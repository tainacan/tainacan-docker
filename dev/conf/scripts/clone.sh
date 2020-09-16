#!/bin/bash

_FOLDER_DESTINATIO="./src/"

_TAINACAN_PLUGIN_REPO="https://github.com/tainacan/tainacan.git"
_TAINACAN_THEME_REPO="https://github.com/tainacan/tainacan-theme.git"


for i in "$@"
do
    case $i in
        --ssh*)
            echo "[USING SSH]"
            _TAINACAN_THEME_REPO="git@github.com:tainacan/tainacan-theme.git"
            _TAINACAN_PLUGIN_REPO="git@github.com:tainacan/tainacan.git"
            shift
        ;;
        #-d=*|--dest=*)
        #    _FOLDER_DESTINATIO = "${i#*=}"
        #    shift # past argument=value
        #;;
        --help)
            echo "
            -ssh =  Abilita o clone dos repositório por ssh. 
            "
            exit
        ;;
    esac
done

#clonando os projetos:
git clone $_TAINACAN_THEME_REPO $_FOLDER_DESTINATIO'tainacan-theme'
git clone $_TAINACAN_PLUGIN_REPO $_FOLDER_DESTINATIO'tainacan'
