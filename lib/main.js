var messages = []
var converter = new showdown.Converter({
    sanitizeHtml: true
});
var converter = new showdown.Converter(); //{sanitizeHtml: true});

function send() {
//window.scrollTo(0, document.body.scrollHeight);
    $('#send').prop('disabled', true)
            $('#talk').prop('disabled', true)
    $('#send').val('等待中...')
            $('#talk').prop('placeholder', "等待中...") //aaa请输入内容，按回车发送")

    $.post({
        url: 'https://api.openai.com/v1/chat/completions',
        data: JSON.stringify({
            model: "gpt-3.5-turbo",
            "messages": messages,
            "temperature": 0.7
        }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + key
        },
        success: function(data) {
            $('#send').prop('disabled', false)
            $('#talk').prop('disabled', false)
            $('#send').val('发送')
            $('#talk').prop('placeholder', "请输入内容，按回车发送") //"等待中...") //aaa请输入内容，按回车发送")
    $('#talk').focus()
            console.log(data)
            $('#usage').text(JSON.stringify(data.usage))
            for (var i in data.choices) {
                var m = data.choices[i].message
                show(m)
            }
        },
        error: function(xhr, status, error) {
            console.log('Error:', error)
            send()
        }
    });
}

function convert(s) {
    //return marked.parse(s);
    //   s=s.replace(/</g,'&lt;').replace(/>/g,'&gt;')
    //    return '<pre>'+s+'</pre>'
    return converter.makeHtml(s);
}

function show(m) {
    console.log(m)
    messages.push(m)
    var s1 = m.role
    var s2 = convert(m.content)
    console.log(s2)

    //$('#messages').append('<div><pre>'+s1+':'+s2+'</pre></div>')
    $('#messages').append('<tr><td >' + s1 + ':</td><td>' + s2 + '</td></tr>')
    //Prism.highlightAll();

    hljs.highlightAll();
window.scrollTo(0, document.body.scrollHeight);
}

function submit() {
    //$('#messages').append('<div>----------------------</div>')
    var s = $('#talk').val()
    if (s.trim().length < 1) return
    $('title').text(s.trim())
    var m = {
        role: 'user',
        content: s
    }
    $('#talk').val('')
    show(m)
    send()
}

$(function() {
    $('#send').click(submit())

    $('#talk').keypress(function(event) {
        if (event.which == 13) {
            submit()
        }
    });
})
