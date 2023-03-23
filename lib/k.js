var converter = new showdown.Converter({
    sanitizeHtml: true
});

//保存json对话记录
function saveblob(name, content) {
    name = name.replace('/', '-').replace('\'', '-')
    //var content = "Hello, World!";
    var blob = new Blob([content], {
        type: "text/plain;charset=utf-8"
    });
    var link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = name; // "myFile.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


const {
    createApp
} = Vue

const app = createApp({
    data() {
        return {
            messages: [],
            multi_line: false,
            t: new Date().getTime(),
            sending: false,
            newmessage: '',
            error: '',
            usage: ''
        }
    },
    updated() {
        //console.log('uuuu')
        hljs.highlightAll();
        window.scrollTo(0, document.body.scrollHeight);
        $('#talk').focus()
    },

    methods: {
        previewFiles(event) {
            //读取json对话记录
            const file = event.target.files[0];

            const reader = new FileReader();
            reader.readAsText(file);

            reader.onload = (event) => {
                var lines = event.target.result.split('\n')
                //messages=[]
                for (var i in lines) {
                    if (lines[i].trim().length < 1) continue
                    var o = JSON.parse(lines[i])
                    this.messages.push(o)
                }
            };

            reader.onerror = (event) => {
                console.error('Error reading file:', event.target.error);
            };
        },

        savemessages() {
            var s = ''
            for (var i in this.messages) {
                s += JSON.stringify(this.messages[i]) + '\n'
            }
            var n = this.messages[0].content + '.json'
            saveblob(n, s)

            s = ''
            for (var i in this.messages) {
                s += this.messages[i].role + ':' + this.messages[i].content.trim() + '\n'
            }
            n = this.messages[0].content + '.txt'
            //txt暂时没用，因为gpt不能读外部连接
            //saveblob(n,s)
        },
        mark(s) {
            return converter.makeHtml(s)
        },
        send2(event) {
            if (event.which == 13) {
                this.send()
            }
        },
        send() {
            if (this.newmessage.trim().length < 1) return
            $('title').text(this.newmessage.trim().trim())
            this.messages.push({
                role: 'user',
                content: this.newmessage
            })
            this.newmessage = ''
            this.sending = true

            $.post({
                url: 'https://api.openai.com/v1/chat/completions',
                data: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    "messages": this.messages,
                    "temperature": 0.7
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + key
                },
                success: data => {
                    this.error = ''
                    this.sending = false
                    console.log(data)
                    this.usage = (JSON.stringify(data.usage))
                    for (var i in data.choices) {
                        var m = data.choices[i].message
                        this.messages.push(m)
                    }
                },
                error: xhr => {
                    console.log(xhr)
                    var s1
                    if (xhr.responseJSON) {
                        s1 = xhr.responseJSON.error.code + ' ' + xhr.responseJSON.error.message + '<br/>'
                    } else {
                        s1 = '连接失败，5秒后重试...<br/>'
                        setTimeout(this.send, 5000)
                    }
                    this.error += s1
                }
            });
        }
    },
})



app.mount('#app')
