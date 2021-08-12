#!/bin/bash
#
### BEGIN INIT INFO
# Provides:   mitemp
# Required-Start: $syslog $network
# Required-Stop:  $syslog
# Default-Start:  2 3 4 5
# Default-Stop:   0 1 6
# Short-Description:  mitemp script
# Description:
#  There is a segfault in mitemp with websockets in "Ubuntu 16.04.2 LTS".
#  To overcome this situation, it shell script uses nodejs forever package
#  to restart mitemp daemon whenever mitemp dead.
### END INIT INFO

# Source function library.
. /lib/lsb/init-functions

NAME=mitemp
DIR=/home/pi/src/mitemp/
SHELLCMD=run-mitemp.sh

user=mitemp
pidfile=/var/run/$NAME.pid
logfile=/var/log/$NAME.log
forever_dir=/root/.forever
forever=/usr/local/bin/forever

start() {
    echo "Starting $NAME instance: "

    if [ "$id" = "" ]; then
        start_daemon $forever start -p $forever_dir --pidFile $pidfile -l $logfile -a --sourceDir $DIR --workingDir $DIR --minUptime 2000 --spinSleepTime 2000 -c sh $SHELLCMD 
        RETVAL=$?
    else
        echo "Instance already running"
        RETVAL=0
    fi
}

restart() {
    echo -n "Restarting $NAME instance : "
    if [ "$id" != "" ]; then
        $forever restart $id
        RETVAL=$?
    else
        start
    fi
}

stop() {
    echo -n "Shutting down $NAME instance : "
    if [ "$id" != "" ]; then
        $forever stop $id
    else
        echo "Instance is not running";
    fi
    RETVAL=$?
}

id=`cat "$pidfile" 2>/dev/null`

case "$1" in
    start)
        start
        ;;
    stop)
        stop
        ;;
    status)
        status -p ${pidfile}
        ;;
    restart)
        restart
        ;;
    *)
        echo "Usage:  {start|stop|status|restart}"
        exit 1
        ;;
esac
exit $RETVAL

