#!/bin/sh

UWSGI="/home/fluxid/compiles/uwsgi-0.9.6/uwsgi"
PROCESSES="1"
HOST="127.0.0.1"
PORT="9061"
VENV="venv"
MODULE="hook"
HARAKIRI="60"
REQUESTS="100"
FILE_PID="uwsgi.pid"
FILE_LOG="uwsgi.log"

WORKING_DIR="$(cd "${0%/*}" 2>/dev/null; dirname "$PWD"/"${0##*/}")"
cd ${WORKING_DIR}


if [ -f "${FILE_PID}" ]; then
	kill -HUP "$(cat "${FILE_PID}")" > /dev/null 2>&1
	if [ "$?" -ne "0" ]; then
		rm "${FILE_PID}"
		RESTART="1"
	fi
else
	RESTART="1"
fi

if [ "${RESTART}" = "1" ]; then
	echo "uWSGI daemon not found, starting."
	"${UWSGI}" \
		-H "${VENV}" \
		--pythonpath "${WORKING_DIR}" \
		-s "${HOST}:${PORT}" \
		-M -p "${PROCESSES}" \
		-w "${MODULE}" \
		-d "${FILE_LOG}" \
		--pidfile "${FILE_PID}" \
		--post-buffering 1048576 \
		--post-buffering-bufsize 5242880 \
		-t "${HARAKIRI}" \
		-R "${REQUESTS}" \
		;
else
	echo "uWSGI daemon reloaded (HUPed) succesfully."
fi
