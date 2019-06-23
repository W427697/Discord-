import path from 'path';

export default function(source) {
  const callback = this.async();

  callback(null, source);
}
