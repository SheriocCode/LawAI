from flask import Flask, Response, request
from flask_cors import CORS
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()
api_key = os.getenv("API_KEY")
base_url = os.getenv("BASE_URL")

app = Flask(__name__)
# CORS(app, resources={r"/*": {"origins": "*"}})  # 允许所有源访问，但请注意生产环境的安全性
CORS(app, resources=r'/*') # 允许所有源访问，但请注意生产环境的安全性

@app.route("/normal_chat", methods=["POST"])
def normal_chat():
    
    # 获取前端发送的消息
    data = request.json
    messages = data.get("messages", [])
    messages.append({"role": "system", "content": "公式块使用$$包围，行内公式使用$包围"})

    client = OpenAI(api_key=api_key, base_url=base_url)
    # 调用 DeepSeek API
    response = client.chat.completions.create(
        model="deepseek-chat",
        messages=messages,
    )
    # 提取响应内容
    content = response.choices[0].message.content if response.choices else "No response"
    
    print(content)
    print(type(content))
    # 返回纯文本响应
    return Response(content, content_type="text/plain")

@app.route("/stream_chat", methods=["POST"])
def stream_chat():
    # 获取前端发送的消息
    data = request.json
    messages = data.get("messages", [])
    messages.append({"role": "system", "content": "公式块使用$$包围，行内公式使用$包围"})

    client = OpenAI(api_key=api_key, base_url=base_url)
    # 调用 DeepSeek API
    response = client.chat.completions.create(
        model="deepseek-chat",
        messages=messages,
        stream=True
    )

    # 定义生成器，逐块返回流式响应
    def generate():
        for chunk in response:
            if chunk.choices:
                content = chunk.choices[0].delta.content
                yield content

    return Response(generate(), content_type="text/plain")




if __name__ == "__main__":
    app.run(debug=True)