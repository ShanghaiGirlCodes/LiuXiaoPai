# 在本地创建项目并初始化
git init
echo "# ShanghaiGirlCodes" > README.md
git add README.md
git commit -m "Initial commit"

# 切到 main 分支
git branch -M main

# 关联远程并推送
git remote add origin https://github.com/<你的用户名>/ShanghaiGirlCodes.git
git push -u origin main

