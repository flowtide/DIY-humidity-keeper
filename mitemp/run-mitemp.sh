set -x
sleep 3
date
python3 /home/pi/src/mitemp/demo.py upload "58:2d:34:38:1f:e4" localhost:8000 
sleep 5
/etc/init.d/bluetooth restart

