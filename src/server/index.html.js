import UUID from 'uuid';

export default function () {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>React Storybook</title>
        <script type="text/javascript">
          window.dataId = '${UUID.v4()}';
        </script>
        <link href='https://fonts.googleapis.com/css?family=Open+Sans:400,300,300italic,400italic,600,600italic,700,700italic' rel='stylesheet' type='text/css'>
        <style>
          /*
            When resizing panels, the drag event breaks if the cursor
            moves over the iframe. Add the 'dragging' class to the body
            at drag start and remove it when the drag ends.
           */
          .dragging iframe {
            pointer-events: none;
          }
          h5 {
              margin: 10px 0;
          }
          h4 {
              font-size: 16px;
              margin: 10px 0;
          }
        </style>
      </head>
      <body style="margin: 0;">
        <div id="root" />
        <script src="/static/admin.bundle.js"></script>
      </body>
    </html>
  `;
}
