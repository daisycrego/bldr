git:
	git add .
	git commit -m "$m"
	git push -u heroku master && git push -u origin master
	heroku logs --tail
	
# usage: make git m="message"