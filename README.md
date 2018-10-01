# tainacan-docker
Docker environments

## dev:
A pasta `repo` vai conter os fontes para desenvolvimento.
```
./tainacan.sh --help

			--build-image =  build imagem docker (super user).
            --build       =  build do plugin e do tema do Tainacan (super user).
            --watch-build =  watch build do plugin e do tema do Tainacan (super user).
            --start       =  iniciar container do Tainacan em segundo plano (super user).
            --stop        =  para execução do container do Tainacan (super user).
            --clone       =  clona o repositorio de codigo do Tainacan.
            --ssh-clone   =  clona o repositorio de codigo do Tainacan usando ssh.
            --run-tests   =  executa os testes unitários (super user).
            --help        =  ajuda.
```

A seguinte ordem deve ser observada para iniciar o ambiente de DEV:

```
1: ./tainacan.sh --clone
2: ./tainacan.sh --build-image
3: ./tainacan.sh --start
4: ./tainacan.sh --build
5: ./tainacan.sh --run-tests
```
A pasta `wp-content` conterá a instalação dos plugins e dos themas para o wordpress.
