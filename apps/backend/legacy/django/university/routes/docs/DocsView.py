import os
from django.http import HttpResponse
from django.views import View


SCHEMA_PATH = os.path.join(os.path.dirname(__file__), '..', '..', '..', 'docs', 'openapi.yaml')

SWAGGER_UI_HTML = """<!DOCTYPE html>
<html>
  <head>
    <title>TTS API Docs</title>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css">
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-standalone-preset.js"></script>
    <script>
      window.onload = function() {
        SwaggerUIBundle({
          url: "/api/schema/",
          dom_id: '#swagger-ui',
          presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
          layout: "StandaloneLayout",
          withCredentials: true,
        });
      }
    </script>
  </body>
</html>"""


class SwaggerUIView(View):
    def get(self, request):
        return HttpResponse(SWAGGER_UI_HTML, content_type='text/html')


class OpenAPISchemaView(View):
    def get(self, request):
        with open(SCHEMA_PATH, 'r') as f:
            content = f.read()
        return HttpResponse(content, content_type='application/yaml')
