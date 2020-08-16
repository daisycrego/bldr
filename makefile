git:
	git add .
	git commit -m "$m"
	git push -u heroku master && git push -u origin master
	
# usage: make git m="message"