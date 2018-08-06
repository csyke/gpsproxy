#!/bin/bash
#
# File:     first_time_setup.sh
# Author:   Brian Onang'o
# Company:	Csyber Systems
# Website:  http://familyfe.csymapp.com
# E-mail:   brian@csymapp.com, brian@cseco.co.ke, surgbc@gmail.com
# Created:	Jan 2018
#
# Description
#
# This script is used when installing MYSQLDB_DBNAME for the first time 
#


configureEnv?() {
	nano ../.env
}

editFile?() {
	nano $1
}

overwriteEnv?() {
	cp ../.env.example ../.env
	askYesNoQuestion "Would you like to configure .env file now? y/n" editFile? "../.env"
}

replaceFolders?() {
	echo "Setting up directories"
		echo -n "config"
			mkdir -p ../config
		echo "...done"
		echo -n "views"
			mkdir -p ../views
		echo "..done"
		echo -n "public"
			mkdir -p ../public/apps
		echo "..done"
		echo -n "routes"
			mkdir -p ../routes
		echo "..done"
}

replaceConfig?() {
	echo "copying system files"
		mkdir -p "../config/"
		echo -n "config"
			cp config/config.system.js.example ../config/config.system.js
		echo "..done"
		echo -n "passport config"
			cp config/config.passport.js.example ../config/config.passport.js
		echo "..done"
		askYesNoQuestion "Would you like to edit system config now? y/n" editFile? "../config/config.system.js"
		askYesNoQuestion "Would you like to edit passport config now? y/n" editFile? "../config/config.passport.js"

}

replaceDatabases?() {
	tput bold;  echo "Mr. Brian: I am now creating databases for you. I hope you remembered to use underscore_to_separate_words in your .env file "; tput sgr0
	#does not work for remote addresses
	[[ $WHICHDATABASE = 'mysql' ]] && {
		[[ $ENV = 'dev' ]] && { 
			mysql -h "$MYSQLDB_HOST_DEV" -u$MYSQLDB_USER_DEV -p"$MYSQLDB_PASS_DEV" -e "DROP DATABASE $MYSQLDB_DBNAME_DEV; CREATE DATABASE IF NOT EXISTS $MYSQLDB_DBNAME_DEV"
			mysql -h "$MYSQLDB_HOST_DEV" -u$MYSQLDB_USER_DEV -p"$MYSQLDB_PASS_DEV" -e "CREATE DATABASE IF NOT EXISTS $MYSQLDB_DBNAME_DEV"
			tput setaf 2;  echo "Mr. Brian has created $MYSQLDB_DBNAME_DEV for you"; tput sgr0 

		} || { 
			mysql -h "$MYSQLDB_HOST" -u$MYSQLDB_USER -p"$MYSQLDB_PASS" -e "DROP DATABASE $MYSQLDB_DBNAME; CREATE DATABASE IF NOT EXISTS $MYSQLDB_DBNAME"
			mysql -h "$MYSQLDB_HOST" -u$MYSQLDB_USER -p"$MYSQLDB_PASS" -e "CREATE DATABASE IF NOT EXISTS $MYSQLDB_DBNAME"
 			tput setaf 2;  echo "Mr. Brian has created $MYSQLDB_DBNAME for you"; tput sgr0 
		}
	}
}

#
# ask a Yes/No question
# usage: askYesNoQuestion "question" function_to_run_if_answer_is_yes
# valid answers are Yes/No. askYesNoQuestion will loop until it gets valid answer
# 
askYesNoQuestion() {
	user=$(whoami)
	tput bold;  echo -n "Mr. Brian: "; tput sgr0
	echo "$1"
	# tput rev;   echo "Mr. Brian: $1";   tput sgr0
	tput bold;  echo -n "$user: "; tput sgr0
	read ans
	case "$ans" in
		[yY] | [yY][Ee][Ss] )
			tput setaf 2;  echo "Mr. Brian will now take you to $2"; tput sgr0
			$2 $3
			;;
		[nN] | [nN][Oo] )
			tput setaf 4;  echo "Mr. Brian will NOT take you to $2"; tput sgr0

			;;
		*)
			tput bold;  echo -n "Mr. Brian: ";    tput sgr0
			tput setaf 1;  echo "Please follow instructions. I will give you another chance to try again."; tput sgr0
			askYesNoQuestion "$1" $2
	esac
}

readConfig () {
	set -a 
	source ../.env
	set +a 
}

installNode? () {
	{
		. ~/.nvm/nvm.sh
		nvm install $1
		nvm use $1 #seems to fail
		sudo mv  /usr/bin/node /usr/bin/node.bac 
		sudo mv  /usr/bin/nodejs /usr/bin/nodejs.bac 
		sudo ln -s   $(which node) /usr/bin/node  
		sudo ln -s   $(which node) /usr/bin/nodejs 
		tput setaf 2;  echo -e "✓ Node v$1 installed"; tput sgr0
	} || {
		{

			curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh |  sudo NVM_DIR=/usr/local/nvm bash
			#=> Close and reopen your terminal to start using nvm or run the following to use it now:
			export NVM_DIR="/usr/local/nvm"
			[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
			[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
			source ~/.nvm/nvm.sh
			nvm install $1
			. nvm use $1
			sudo mv  /usr/bin/node /usr/bin/node.bac 
			sudo mv  /usr/bin/nodejs /usr/bin/nodejs.bac 
			sudo ln -s   $(which node) /usr/bin/node  
			sudo ln -s   $(which node) /usr/bin/nodejs 
			tput setaf 2;  echo -e "✓ Node v$1 installed"; tput sgr0
		} || {
			tput setaf 1;  echo -e "✗ Mr. Brian has tried his best to install node v$1 but has failed. You will have to do this manually"; tput sgr0
		}
	}
	

}

installYarn? () {
	echo " Installing yarn"
	curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
	echo "deb http://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
	sudo apt-get update && sudo apt-get install yarn


}

installNginx? () {
	echo " Installing nginx"
	sudo apt-get install nginx


}

# https://www.weatherstationlab.com/davis-vantage-pro-2-review/
#
# check a dependency in /usr/bin/
# checkDependency dependency function_to_install_dependency required_version
checkDependency? () {
	{

		{
			which $1 >> /dev/null
		}  && {
			nodeVersion=$("/usr/bin/$1" -v |head -2 |tail -2 | head -1| rev | cut -d v -f 1 | rev )
			[[ "$3" = "$(printf "$3\n$nodeVersion\n" | sort -g | head -1)" ]] && {
				tput setaf 2;  echo -e "✓ Right version of $1 is installed"; tput sgr0
			} || {
				askYesNoQuestion "Your $1 version ($nodeVersion) is not the required version ($3). Would you like to install version $3 now?" $2 $3
			}		
		} || {
			askYesNoQuestion "You don't seem to have $1 installed. Would you like to install it now?" $2 $3
		}
	}
}

setupDefaultUsers? () {
	cd ./setup
	echo $PWD
	node first_time_setup.js
}
################################################################################
# Main
################################################################################
#dependencies
NODE_VERSION=8.9.4
YARN_VERSION=0.0.1

main() {
	echo "Hello there. Greetings from Mr. Brian"
	echo "Mr. Brian will now install GPSPROXY for you."
	echo "This will be very interactive. So please stay around"

	#check for right version of node, yarn, etc
	checkDependency? node installNode? $NODE_VERSION
	checkDependency? yarn installYarn? $YARN_VERSION
	checkDependency? nginx installNginx?


	#Overwrite environment variables (in .env)
	askYesNoQuestion "Would you like to overwrite environment variables Y(es)/N(o)? Please answer Yes if this is the first time you are doing this setup." "overwriteEnv?"
	
	#Overwrite existing configurations
	askYesNoQuestion "Would you like to replace config file? You will have to make the configurations again. Please answer Y(es) if this is the very first time you are doing this set-up. Otherwise you will have to come back here again. Please answer Y(es) or N(o)"  "replaceConfig?"

	#read from ../.env

	# rsync -a ./ root@traccarproxy.cseco.co.ke:/var/www/html/gpsproxy/

	readConfig
	[[ $ENV = 'dev' ]] && { 
		PORT=3010 && URL=$BASE_URL_DEV 
	} || { 
		PORT=$PORT && URL=$BASE_URL 
	}


	#port Config for you
	tput bold;  echo "Mr. Brian: I am now creating links for you."; tput sgr0
	THISPLACE=$(pwd)
	echo "$THISPLACE/../install/portConfig/"

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

	tput bold;  echo "Mr. Brian: I am now creating the service for you."; tput sgr0
	sudo cp -r "../install/lib" /

	systemctl daemon-reload
	systemctl enable gpsproxy.service
	systemctl start gpsproxy.service


	tput bold;  echo "Mr. Brian: I am now restarting nginx for you."; tput sgr0
	sudo systemctl restart nginx

	#yarn install
	tput bold;  echo "Mr. Brian: I am now installing node modules for you."; tput sgr0
	cd ../
	yarn install
	cd setup

	#start server
	{
		cd ../
		node bin/app.js
		tput bold;  echo -n "Mr. Brian: "; tput sgr0
		tput setaf 2;  echo "$user, your setup is done. Goto $URL:$PORT to see your new application"; tput sgr0
		tput setaf 2;  echo "Mr. Brian has now to go and do other duties. But you can always reach him with queries @ $AUTHOR_EMAIL"; tput sgr0

	} && {
		tput bold;  echo -n "Mr. Brian: ";    tput sgr0
		tput setaf 1;  echo "Server failed to start. Mr. Brian can go no further than this for now. Please find a way of fixing it yourself. If you have queries you can always reach Mr. Brian @ $AUTHOR_EMAIL"; tput sgr0
	}
	
}

#
# Execution begins here
#
main