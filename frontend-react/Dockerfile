FROM node:20-alpine AS builder
WORKDIR /app

# Copy ALL files including updated package-lock.json
COPY . .

# Install dependencies
RUN npm ci --include=dev

# Fix tsconfig issue if it exists
RUN if [ -f "tsconfig.app.json" ]; then \
    sed -i 's/"ignoreDeprecations": "6.0"/"ignoreDeprecations": "5.0"/g' tsconfig.app.json; \
    fi

# Build
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy Nginx config
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]