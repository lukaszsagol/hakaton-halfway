#!/bin/sh

UWSGI="/home/fluxid/compiles/uwsgi-0.9.6/uwsgi"
FILE_PID="uwsgi.pid"

WORKING_DIR="$(cd "${0%/*}" 2>/dev/null; dirname "$PWD"/"${0##*/}")"
cd ${WORKING_DIR}

if [ -f "${FILE_PID}" ]; then
	if (kill -INT "$(cat "${FILE_PID}")" > /dev/null 2>&1); then
		echo "Killed uWSGI"
	else	
		echo "Couldn't kill uWSGI... Is it really working?"
	fi
	rm "${FILE_PID}"
else
	echo "No PIDfile found"
fi
