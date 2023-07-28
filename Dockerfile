# Build backend image
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS backend-builder

WORKDIR /app

# Copy backend project files
COPY Concord/*.csproj ./Concord/
WORKDIR /app/Concord
RUN dotnet restore

# Copy backend source code
COPY Concord/ ./
RUN dotnet publish -c Release -o out

# Build frontend image
FROM node:16 AS frontend-builder

WORKDIR /app

# Copy frontend project files
COPY frontend/package.json frontend/yarn.lock ./
RUN yarn install

# Copy frontend source code
COPY frontend/ ./
RUN yarn build

# Build final image
FROM mcr.microsoft.com/dotnet/aspnet:7.0

WORKDIR /app

# Copy backend binaries
COPY --from=backend-builder /app/Concord/out ./

# Copy frontend assets
COPY --from=frontend-builder /app/wwwroot ./wwwroot

# Set environment variables
ENV ASPNETCORE_URLS=http://+:5000
ENV ASPNETCORE_ENVIRONMENT=Production

# Expose ports
EXPOSE 5000/tcp
EXPOSE 80/tcp

# Run the application
ENTRYPOINT ["dotnet", "Concord.dll"]
