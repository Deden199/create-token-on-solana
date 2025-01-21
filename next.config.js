/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export', // Menambahkan pengaturan ini untuk static export
  // Tambahkan konfigurasi lain jika diperlukan
  ignoreDuringBuilds: true,

};

module.exports = nextConfig;
