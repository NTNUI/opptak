FROM mongo
# Will be set through Environment Files
ARG DATABASE_URI
ARG USERNAME
ARG PASSWORD

ENV DATABASE_URI ${DATABASE_URI}
ENV USERNAME ${USERNAME}
ENV PASSWORD ${PASSWORD}

COPY admissionperiod.json /admissionperiod.json
COPY applications.json /applications.json
COPY committees.json /committees.json
COPY statuses.json /statuses.json

CMD mongoimport --username ${USERNAME} --password ${PASSWORD} --uri ${DATABASE_URI} --collection admissionperiod --drop --file /admissionperiod.json --jsonArray & mongoimport --username ${USERNAME} --password ${PASSWORD} --uri ${DATABASE_URI} --collection applications --drop --file /applications.json --jsonArray & mongoimport --username ${USERNAME} --password ${PASSWORD} --uri ${DATABASE_URI} --collection committees --drop --file /committees.json --jsonArray & mongoimport --username ${USERNAME} --password ${PASSWORD} --uri ${DATABASE_URI} --collection statuses --drop --file /statuses.json --jsonArray