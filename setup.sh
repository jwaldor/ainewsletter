sudo dnf install -y curl
curl -fsSL https://bun.sh/install | bash
curl -fsSL https://rpm.nodesource.com/setup_current.x | sudo bash -
sudo dnf install -y nodejs
sudo yum install cronie -y
sudo systemctl enable crond.service
sudo systemctl start crond.service