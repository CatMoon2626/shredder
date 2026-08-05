# 軽量なNginxのAlpineベースイメージを使用
FROM nginx:alpine

# 作成したHTML/CSS/JSファイルをコンテナ内のNginx公開ディレクトリにコピー
COPY ./html /usr/share/nginx/html

# Nginxのデフォルトポート
EXPOSE 80