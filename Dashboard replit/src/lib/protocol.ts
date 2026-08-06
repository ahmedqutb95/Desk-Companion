export function createDisplayTextMessage(text: string) {
  return {
    type: 'display_text',
    text,
  };
}
