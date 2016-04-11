export default function (headHtml) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>React Storybook</title>
        ${headHtml}
        <link href='https://fonts.googleapis.com/css?family=Open+Sans:400,300,300italic,400italic,600,600italic,700,700italic' rel='stylesheet' type='text/css'>
        <style>
            html {
                font-family: 'Open Sans', Helvetica, Arial, sans-serif;
            }
        </style>
      </head>
      <body>
        <div id="root" />
        <script src="/static/preview.bundle.js"></script>
      </body>
    </html>
  `;
}
