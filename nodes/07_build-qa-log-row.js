const prompt = $('Build QA Prompt').first().json;
const answer = $input.first().json.output?.[0]?.content?.[0]?.text || '';
const now = new Date().toISOString();

return [{
  json: {
    timestamp: now,
    chat_id: prompt.chatId || '',
    filename: prompt.filename || '',
    question: prompt.question || '',
    answer
  }
}];
