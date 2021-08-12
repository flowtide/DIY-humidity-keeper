#!/usr/bin/env python3
"""Demo file showing how to use the mitemp library."""

import argparse
import re
import logging
import sys
import time
import requests

from btlewrap import available_backends, BluepyBackend, GatttoolBackend, PygattBackend
from mitemp_bt.mitemp_bt_poller import MiTempBtPoller, \
    MI_TEMPERATURE, MI_HUMIDITY, MI_BATTERY


def valid_mitemp_mac(mac, pat=re.compile(r"[0-9A-F]{2}:[0-9A-F]{2}:[0-9A-F]{2}:[0-9A-F]{2}:[0-9A-F]{2}:[0-9A-F]{2}")):
    """Check for valid mac adresses."""
    if not pat.match(mac.upper()):
        raise argparse.ArgumentTypeError('The MAC address "{}" seems to be in the wrong format'.format(mac))
    return mac


def poll(args):
    """Poll data from the sensor."""
    while True:
        backend = _get_backend(args)
        poller = MiTempBtPoller(args.mac, backend)
        print("Getting data from Mi Temperature and Humidity Sensor")
        print("FW: {}".format(poller.firmware_version()))
        print("Name: {}".format(poller.name()))
        print("Battery: {}".format(poller.parameter_value(MI_BATTERY)))
        print("Temperature: {}".format(poller.parameter_value(MI_TEMPERATURE)))
        print("Humidity: {}".format(poller.parameter_value(MI_HUMIDITY)))
        time.sleep(5)

# def scan(args):
#     """Scan for sensors."""
#     backend = _get_backend(args)
#     print('Scanning for 10 seconds...')
#     devices = mitemp_scanner.scan(backend, 10)
#     devices = []
#     print('Found {} devices:'.format(len(devices)))
#     for device in devices:
#         print('  {}'.format(device))


def _get_backend(args):
    """Extract the backend class from the command line arguments."""
    if args.backend == 'gatttool':
        backend = GatttoolBackend
    elif args.backend == 'bluepy':
        backend = BluepyBackend
    elif args.backend == 'pygatt':
        backend = PygattBackend
    else:
        raise Exception('unknown backend: {}'.format(args.backend))
    return backend


def list_backends(_):
    """List all available backends."""
    backends = [b.__name__ for b in available_backends()]
    print('\n'.join(backends))

def upload(args):
    #print("upload start")
    while True:
        backend = _get_backend(args)
        #print(backend)
        poller = MiTempBtPoller(args.mac, backend)
        #print(poller)
        IP = args.IP
        MAC = args.mac
        #print(IP)
        url = ('http://%s/api/v1/devices/notify' %IP)
        #print(url)
        TEMP = str(poller.parameter_value(MI_TEMPERATURE))
        HUMI = str(poller.parameter_value(MI_HUMIDITY))
        BATTERY = str(poller.parameter_value(MI_BATTERY))
        with requests.Session() as session:
            get_url = url + '?mac=' + MAC + '&temperature=' + TEMP + '&humidity=' + HUMI + '&battery=' + BATTERY
            with session.get(get_url) as response:
                print("response - " + str(response));
        time.sleep(180)
        
def main():
    """Main function.

    Mostly parsing the command line arguments.
    """
    parser = argparse.ArgumentParser()
    parser.add_argument('--backend', choices=['gatttool', 'bluepy', 'pygatt'], default='gatttool')
    parser.add_argument('-v', '--verbose', action='store_const', const=True)
    subparsers = parser.add_subparsers(help='sub-command help', )

    parser_poll = subparsers.add_parser('poll', help='poll data from a sensor')
    parser_poll.add_argument('mac', type=valid_mitemp_mac)
    parser_poll.set_defaults(func=poll)

    # parser_scan = subparsers.add_parser('scan', help='scan for devices')
    # parser_scan.set_defaults(func=scan)

    parser_scan = subparsers.add_parser('backends', help='list the available backends')
    parser_scan.set_defaults(func=list_backends)
    
    parser_upload = subparsers.add_parser('upload', help='upload data to webserver')
    parser_upload.add_argument('mac', type=valid_mitemp_mac)
    parser_upload.add_argument('IP', type=str)
    parser_upload.set_defaults(func=upload)
    
    args = parser.parse_args()

    if args.verbose:
        logging.basicConfig(level=logging.DEBUG)

    if not hasattr(args, "func"):
        parser.print_help()
        sys.exit(0)

    args.func(args)

if __name__ == '__main__':
    main()
    
