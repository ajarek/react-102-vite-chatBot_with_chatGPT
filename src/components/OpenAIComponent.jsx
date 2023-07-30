import { useState } from 'react'
import { Configuration, OpenAIApi } from 'openai'
import './OpenAIComponent.css'

const configuration = new Configuration({
  apiKey: import.meta.env.VITE_API_GPT_KEY,
})
delete configuration.baseOptions.headers['User-Agent']
const openai = new OpenAIApi(configuration)

function OpenAIComponent() {
  const [messages, setMessages] = useState([
    {
      content: 'Witaj , jestem Twoim asystentem.',
      role: 'assistant',
    },
    {
      content: 'Tu otrzymasz odpowiedzi asystenta!',
      role: 'user',
    },
  ])

  const [isTyping, setIsTyping] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('submit')
    const newMessage = {
      content: e.target[0].value,
      role: 'user',
    }

    const newMessages = [...messages, newMessage]
    setMessages(newMessages)
    setIsTyping(true)
    e.target.reset()

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [...newMessages],
    })

    setMessages([...newMessages, completion.data.choices[0].message])
    setIsTyping(false)
  }

  return (
    <section className='container '>
      <div className='col'>
        <div className='wrapper'>
          {messages.length &&
            messages.map((msg, i) => {
              return (
                <div
                  className={`chat ${
                    msg.role === 'assistant' ? 'chat-start' : 'chat-end'
                  }`}
                  key={'chatKey' + i}
                >
                  <div
                    className='chat-image '
                    style={
                      msg.role === 'assistant'
                        ? { background: '#ff9f1a' }
                        : { background: '#1db954' }
                    }
                  >
                    <img
                      src={
                        msg.role === 'assistant'
                          ? '/images/bot.png'
                          : '/images/user.png'
                      }
                    />
                  </div>
                  <div className='chat-bubble'>{msg.content}</div>
                </div>
              )
            })}
        </div>

        <form
          className='form'
          onSubmit={(e) => handleSubmit(e)}
        >
          <div className='form-input'>
            {isTyping && <small className='absolute'>GPT pisze...</small>}

            <input
              type='text'
              placeholder='ChatGPT, Zadaj pytanie!'
              className='input'
              required
              autoFocus={true}
            />
            <button
              className='btn '
              type='submit'
            >
              <img
                src='/images/filled-sent.png'
                alt='sent'
              />
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

export default OpenAIComponent
