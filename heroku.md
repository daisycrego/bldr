## Memory limit error?

If there is a memory limit error within node - e.g. if you run out of memory, you can increase that memory for the heroku dyno:

```bash
heroku config:set NODE_OPTIONS="--max_old_space_size=5000" -a poem-builder
```
