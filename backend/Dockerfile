FROM php:8.0-apache

# Install required extensions
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Enable mod_rewrite
RUN a2enmod rewrite

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Set working directory
WORKDIR /var/www/html

# Copy PHP files
COPY . .

# Set permissions
RUN chown -R www-data:www-data /var/www/html

# Expose port
EXPOSE 80

CMD ["apache2-foreground"]
