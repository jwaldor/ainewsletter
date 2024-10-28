source .env
scp -i ./$PEM_FILE ./job.ts ec2-user@$EC2_INSTANCE_URL:/home/ec2-user/job.ts
scp -i ./$PEM_FILE ./package.json ec2-user@$EC2_INSTANCE_URL:/home/ec2-user/package.json
scp -i ./$PEM_FILE ./package-lock.json ec2-user@$EC2_INSTANCE_URL:/home/ec2-user/package-lock.json
scp -i ./$PEM_FILE ./.env ec2-user@$EC2_INSTANCE_URL:/home/ec2-user/.env
ssh -i ./$PEM_FILE ec2-user@$EC2_INSTANCE_URL "npm install"
ssh -i ./$PEM_FILE ec2-user@$EC2_INSTANCE_URL "source .env"
ssh -i ./$PEM_FILE ec2-user@$EC2_INSTANCE_URL "cd /home/ec2-user && bun job.ts"
