const converter = new showdown.Converter({
    sanitizeHtml: true,

    extensions: [
      showdownKatex({
        // maybe you want katex to throwOnError
        throwOnError: true,
        // disable displayMode
        displayMode: false,
        // change errorColor to blue
        errorColor: '#1500ff',
      }),
    ],
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

function resize_textarea(t) {
    t.style.height = 'auto';
    t.style.height = t.scrollHeight + 'px';
}


const {
    createApp
} = Vue

//在某些vue js update之后，标记不要进行涂色和滚动操作
prompts.unshift({
    'act': '选择角色扮演',
    'prompt': ''
})


let message_threshold

const app = createApp({
    data() {
        return {
            //历史聊天记录
            messages: [],
            //标记哪些聊天记录处于编辑状态
            editing: {},
            //输入框中的内容
            newmessage: '',
            //撤回的时候会用到。原本其实撤回可以取值messages.pop，但是因为我们加了前缀咒语，所以就需要多一个变量来记录被咒语修改之前的对话
            oldmessage:'', 
            //控制输入框的高度
            multi_line: 1, 
            //表达当前状态是否在发送消息
            sending: false,
            //表达当前状态是否失败。或许可以考虑把所有状态合并到一个变量
            failed: false,
            //反馈到页面的错误信息
            error: '',
            //记录tokens
            usage: "",
            //角色扮演的下拉菜单
            prompts: prompts,
            selectedPrompt: '',
            //前置咒语的下拉菜单
            prefix_spells:prefix_spells,
            selectedSpell:'',
            //tokens阀值，基于它，页面可以自动删除超出阀值限制的早期信息。但是我们缺乏tokens的计算办法，所以这个操作是很不准确的
            tokens_threshold: 3000,
            //在不准确的tokens限额操作下的辅助变量
            old_messages_length: 0,
            //open ai API中的随机性
            temperature: 0.7,
            //open ai API中的多个回答。暂时没有好的设计概念，所以不用。一种可能的概念是需要让用户从多个回答中选出一条
            n_choicies: 1
        }
    },
    updated() {
        //高亮
        hljs.highlightAll();
        //调整textarea的高度
        const t = $('.history textarea')
        for (var i = 0; i < t.length; i++)
            resize_textarea(t[i])

        //调整聊天记录的高度，因为工具栏的高度是变动的，会影响到聊天记录的显示
        var h1 = $('.toolbar').height()
        var h2 = $('.bottom-toolbar').height()
        $('.history').css('margin-top', h1)
        $('.history').css('margin-bottom', h2)

        if (this.messages.length > this.old_messages_length) {
            //滚动到底部
            window.scroll(0, document.body.scrollHeight);
            //输入框
            $('#talk').focus()
        }
        this.old_messages_length = this.messages.length
    },


    methods: {
        previewFiles(event) {
            //读取json对话记录
            const file = event.target.files[0];

            const reader = new FileReader();
            reader.readAsText(file);

            reader.onload = (event) => {
                //清空
                while (this.messages.length > 0) this.messages.pop()
                //读取
                let lines = event.target.result.split('\n')
                for (let i in lines) {
                    if (lines[i].trim().length < 1) continue
                    this.messages.push(JSON.parse(lines[i]))
                }
            };
            reader.onerror = (event) => {
                console.error('Error reading file:', event.target.error);
            };
        },

        startPrompt() {
            //读取一个角色
            if (this.selectedPrompt.trim().length > 0)
                this.messages.push({
                    'role': 'system',
                    'content': this.selectedPrompt
                })
        },
        deletemessage(index) {
            //删除单一条目的时候，不要滚动到页面尾部
            this.messages.splice(index, 1)
        },
        editmessage(index) {
            //编辑单一条目的时候，不要滚动到页面尾部
            this.editing[index] = !this.editing[index]
        },
        savemessages() {
            let s = ''
            for (let i in this.messages)
                s += JSON.stringify(this.messages[i]) + '\n'
            //总有些时候会不小心保存到过长的字符串，所以要截取
            let n = this.messages[0].content.substr(0, 60) + '.json'

            saveblob(n, s)

            /*
            s = ''
            for (let i in this.messages) {
                s += this.messages[i].role + ':' + this.messages[i].content.trim() + '\n'
            }
            n = this.messages[0].content + '.txt'
            //txt暂时没用，因为gpt不能读外部连接
            //saveblob(n,s)
            //
            */
        },
        mark(s) {
            return converter.makeHtml(s)
        },
        send2(event) {
            //检测到回车，然后发送
            if (event.which == 13) {
                this.sendnew()
            }
        },
        /*
        senden() {
            //把提问翻译后发送
            this.newmessage = '(Translate this question into English, and then answer it in English, and then translate it into Chinese.)' + this.newmessage
            this.sendnew()

        },
        sendzh() {
            this.newmessage = '(请以你的理解把这个提问用中文完整规范的复述一遍，然后回答它。)' + this.newmessage
            this.sendnew()

        },
        */
        sendnew() {
            if (this.sending) return

            this.oldmessage=this.newmessage
            this.newmessage = this.selectedSpell + this.newmessage

            for (var i in this.editing)
                this.editing[i] = false

            //从输入框读取，然后发送
            if (this.newmessage.trim().length < 1) return
            this.messages.push({
                role: 'user',
                content: this.newmessage
            })
            //修改标题
            $('title').text(this.oldmessage.trim())
            this.newmessage = ''
            this.send()
        },
        retry() {
            //重试发送
            this.failed = false
            this.error = ''
            this.send()
        },
        withdraw() {
            //撤回一次失败的发送
            this.failed = false
            this.error = ''
            this.sending = false
            /*
            let m = this.messages.pop()
            this.newmessage = m.content
            */
            this.newmessage = this.oldmessage
            this.oldmessage=''
            this.messages.pop()
        },
        abort() {
            this.sending.abort()
        },
        send() {
            //当使用的token超出额度的时候，删除两条对话
            if (this.usage.total_tokens > this.tokens_threshold) {
                //删除前先保存
                this.savemessages()
                this.error += '因为tokens长度超出'+this.tokens_threshold+'而保存文件。<br/>'
                while (this.messages.length > 1 + message_threshold) {
                    this.messages.shift()
                    this.error += '删除一条超出tokens长度限制的顶部对话。<br/>'
                }
            }

            //发送

            this.sending = $.post({
                url: 'https://api.openai.com/v1/chat/completions',
                data: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    "messages": this.messages,
                    "temperature": parseFloat(this.temperature)
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + key
                },
                success: data => {
                    this.error = ''
                    this.sending = false
                    console.log(data)
                    this.usage = data.usage
                    for (let i in data.choices)
                        this.messages.push(data.choices[i].message)

                    //当使用的token超出额度的时候，删除两条对话
                    //但是我们没理由马上删，可以等到下次send再删除。所以这里先记录下目标要删到多少条messages
                    if (this.usage.total_tokens > this.tokens_threshold) {
                        message_threshold = this.messages.length - 2
                    }

                },
                error: xhr => {
                    this.failed = true
                    console.log(xhr)
                    let s1
                    if (xhr.responseJSON) {
                        s1 = xhr.responseJSON.error.code + ' ' + xhr.responseJSON.error.message + '<br/>'
                    } else {
                        s1 = '连接失败，5秒后自动重连...<br/>'
                        //setTimeout(this.send, 5000)
                        s1 = '连接失败' //，5秒后自动重连...<br/>'
                    }
                    this.error += s1
                }
            });
        }
    },
})



app.mount('#app')

$(function(){
    //当当前页面没有聚焦元素，或者聚焦body的时候，按下了回车，那么聚焦输入栏
    $('body').on('keydown',function(e){
        if(e.keyCode==13){
            let ae=document.activeElement
            if((!ae)||(ae.tagName=='BODY')){
                console.log(ae)
                console.log(e)
                $('#talk').focus()
                return false
            }
        }
    })
})
