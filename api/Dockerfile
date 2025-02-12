# Build stage
FROM golang:1.22 AS builder

WORKDIR /app
COPY go.mod go.sum 
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o nalevel-app .

# Final stage
FROM debian:bookworm-slim
COPY --from=builder /app/nalevel-app /app/
EXPOSE 8080
CMD ["/app/nalevel-app"]

# # --- Build Stage ---
# FROM golang:1.22-bullseye AS builder  

# WORKDIR /app
# COPY go.mod go.sum 
# RUN --mount=type=cache,target=/go/pkg/mod \
#     go mod download -x

# COPY . .
# RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o nalevel-app .

# # --- Final Stage ---
# FROM gcr.io/distroless/static-debian12  
# COPY --from=builder --chown=nonroot:nonroot /app/nalevel-app /
# USER nonroot:nonroot
# EXPOSE 8080
# CMD ["/nalevel-app"]

# # --- Build Stage ---
# FROM golang:1.22-alpine AS builder

# # Install git and ca-certificates (these likely won't change often)
# RUN apk add --no-cache git ca-certificates

# WORKDIR /app

# # Copy go.mod and go.sum *first* (these change less often than your source code)
# COPY go.mod go.sum ./
# # Download dependencies (this layer will be cached unless go.mod/go.sum change)
# RUN go mod download

# # Copy the *rest* of your source code (this changes most frequently)
# COPY . .

# # Build the Go application (this layer will only be rebuilt if the previous COPY layer changes)
# RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o nalevel-app .

# # --- Final Stage ---
# FROM alpine:3.19

# # Create a non-root user (this won't change often)
# RUN addgroup -g 1001 -S appuser && adduser -u 1001 -S appuser -G appuser

# WORKDIR /app

# # Copy *only* the binary (this will be cached unless the binary changes)
# COPY --from=builder /app/nalevel-app /app/

# # Set ownership (this won't change often)
# RUN chown appuser:appuser /app/nalevel-app

# USER appuser

# EXPOSE 8080

# CMD ["./nalevel-app"]