#sudo docker build -t hanna-webpage-be .
#sudo docker run -i -t hanna-webpage-be

#aws ecr get-login-password --region us-west-1 | docker login --username AWS --password-stdin 191518685251.dkr.ecr.us-west-1.amazonaws.com
#docker tag hanna-webpage-be:latest 191518685251.dkr.ecr.us-west-1.amazonaws.com/hanna-webpage-be:latest
#docker push 191518685251.dkr.ecr.us-west-1.amazonaws.com/hanna-webpage-be:latest

#This only has to be done 1 time (per project).
#aws ecr create-repository --repository-name hanna-webpage-be

#kubectl apply -f hanna-webpage-be-deployment.yaml

#This only has to be done 1 time (per workstation).
#aws eks --region us-west-1 update-kubeconfig --name bdm-cluster
#kubectl cluster-info


FROM node:16.15.1

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

COPY prod.env .env

CMD [ "npm", "start" ]
