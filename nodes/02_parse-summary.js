const resp = $input.first().json;
const rawContent = resp.choices?.[0]?.message?.content || '';
const chatId = $('Build Summary Prompt').first().json.chatId;
const fileName = $('Telegram Trigger').first().json.message?.document?.file_name || 'prospektus.pdf';

return [{
  json: {
    output: rawContent,
    chatId,
    fileName
  }
}];
