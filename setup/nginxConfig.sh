#!/bin/bash

main() {
	#port Config for you
	tput bold;  echo "Mr. Brian: I am now creating links for you."; tput sgr0
	THISPLACE=$(pwd)

	for file in "$THISPLACE/../install/portConfig/"*
	do
	echo $file
	  if [ -f "$file" ]; then
	  		FILENAME=$(echo $file | rev | cut -d"/" -f1 | rev)
			tput setaf 2;  echo "Mr. Brian: I am linking $file"; tput sgr0
			sudo rm "/etc/nginx/sites-enabled/$FILENAME"
			sudo ln -s $file /etc/nginx/sites-enabled/
	  fi
	done

	tput bold;  echo "Mr. Brian: I am now restarting nginx for you."; tput sgr0
	sudo systemctl restart nginx
	
}

#
# Execution begins here
#
main