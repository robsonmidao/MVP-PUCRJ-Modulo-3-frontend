# Define a imagem base do nginx
FROM nginx

# Copia os arquivos de requisitos para o diretório de trabalho do nginx
COPY . /usr/share/nginx/html

EXPOSE 80

#Define o comando de execução do servidor nginx
CMD ["nginx","-g", "daemon off;"]
 