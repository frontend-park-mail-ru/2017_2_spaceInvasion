var commit_message = ""
echo 'Welcome to AutoDeployer v.1.0'
echo 'Starting deployment..'
echo 'Preparing files..'
sleep 3s
echo 'Done.'
echo 'Enter commit message: '
read commit_message
git add .
git commit -m "$commit_message"
git push heroku master
heroku open