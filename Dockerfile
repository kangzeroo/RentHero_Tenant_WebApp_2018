FROM nodesource/trusty:6.3.1

ADD package.json package.json
RUN npm install --only=dev
RUN npm install
RUN npm install -g forever
ADD . .
ADD ./src/manifest.json ./dist/manifest.json
RUN npm run build

EXPOSE 4001
EXPOSE 4000
EXPOSE 80
EXPOSE 443

CMD ["npm","run", "prod"]
