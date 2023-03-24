import requests
import os
#u='https://raw.githubusercontent.com/f/awesome-chatgpt-prompts/main/prompts.csv'
#if not os.path.exists('prompts.csv'):
#    s=requests.get(u)
#    with open('prompts.csv','wb') as f:
#        f.write(s)
#
import csv
import json

csvfile = open('./prompts.csv')
#fieldnames = ("act","content")
#reader = csv.DictReader( csvfile, fieldnames)
#, fieldnames)

#预期csv的第一行有名字定义
reader = csv.DictReader( csvfile)

l=[m for m in reader]
#去掉第一行的标题
#l=l[1:]
with open('./prompts.json','w') as f:
    json.dump(l,f)

#因为现在的html倾向是直接拖入浏览器，而不是开http server，所以js比json适用性更好
with open('./prompts.js','w') as f:
    s=json.dumps(l)
    f.write('prompts='+s)
