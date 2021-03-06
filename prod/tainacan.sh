#!/bin/bash

container=''
CMD='sudo docker exec -it '
CMD_OPT=''

help () {
  echo "help:"
  echo "--container=[ID_CONTAINER]"
  echo "--setup-init"
  echo "--install-plugin"
  echo "--install-theme"
  echo "--update-plugin"
  echo "--update-theme"
  echo "--upgrade-wp"
  echo "--install-theme"
  echo "--install-language=pt_BR"
  echo "exemple of use: ./tainacan.sh --container=wordpress_tainacan --install-plugin"
}

while [ "$1" != "" ]; do
  PARAM=`echo $1 | awk -F= '{print $1}'`
  VALUE=`echo $1 | awk -F= '{print $2}'`
  case $PARAM in
    -h | --help)
      help
      exit
    ;;
    --container)
      container=$VALUE
    ;;
    --install-plugin)
      echo "[INSTALL PLUGIN]"
      CMD_OPT='install-tainacan-plugin.sh'
    ;;
    --install-theme)
      echo "[INSTALL THEME]"
      CMD_OPT='install-tainacan-theme.sh'
    ;;
    --update-plugin)
      echo "[UPDATE PLUGIN]"
      CMD_OPT='install-tainacan-plugin.sh'
    ;;
    --update-theme)
      echo "[UPDATE THEME]"
      CMD_OPT='install-tainacan-theme.sh'
    ;;
    --upgrade-wp)
      echo "[UPGRADE WP]"
      CMD_OPT='upgrade-wp.sh'
    ;; 
    --install-theme)
      echo "[INSTALL THEME]"
      CMD_OPT='install-tainacan-theme.sh'
    ;;
    --setup-init)
      echo "[SETUP INITIAL OF TAINACAN]"
      CMD_OPT='setup-init.sh'
    ;;
    --install-language)
      echo "[SETUP INITIAL OF TAINACAN]"
      CMD_OPT="wp-install-language.sh ${VALUE}"
    ;;
    *)
      echo "ERROR: unknown parameter \"$PARAM\""
      usage
      exit 1
    ;;
  esac
  shift
done

if [ -z "$container" ] || [ -z "$CMD_OPT" ]; then
  echo "ERROR: unknown parameter" 
else
  ${CMD} ${container} ${CMD_OPT}
fi
