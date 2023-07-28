# Build backend image
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS backend-builder

WORKDIR /Concord

# Copy backend project files
COPY Concord/*.csproj ./
RUN dotnet restore

# Copy backend source code
COPY Concord/ ./
RUN dotnet publish -c Release -o out

# Build frontend image
FROM node:16 AS frontend-builder

WORKDIR /Concord

# Copy frontend project files
COPY Concord/frontend/package.json Concord/frontend/yarn.lock ./
RUN yarn install

# Copy frontend source code
COPY Concord/frontend/ ./
RUN yarn build

# Build final image
FROM mcr.microsoft.com/dotnet/aspnet:7.0

WORKDIR /Concord

# Copy backend binaries
COPY --from=backend-builder /Concord/out ./

# Copy frontend assets
COPY Concord/wwwroot ./wwwroot

# Set environment variables
ENV ASPNETCORE_URLS=http://+:5000
ENV ASPNETCORE_ENVIRONMENT=Production

# Expose ports
EXPOSE 5000/tcp
EXPOSE 80/tcp

# Run the application
ENTRYPOINT ["dotnet", "Concord.dll"]
