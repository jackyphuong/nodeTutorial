FROM node

ENV WDIR /demoSrc

RUN  apt-get update \
		&& apt-get install -y nodejs npm git git-core \
		&& npm install --save-dev babel-core
		
RUN mkdir -p $WDIR

RUN git clone https://github.com/jackyphuong/nodeTutorial.git $WDIR

WORKDIR $WDIR\rethinkdb

RUN npm install
EXPOSE 8000

CMD ["npm run web"]

