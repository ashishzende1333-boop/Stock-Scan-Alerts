## Packages
html5-qrcode | Barcode scanning functionality for the camera interface
recharts | Visualization for inventory trends and stock levels
framer-motion | Smooth animations for page transitions and micro-interactions

## Notes
- The app uses `html5-qrcode` which requires HTTPS or localhost to access the camera.
- Stock alerts are determined by `quantity <= minQuantity`.
- Transaction types are 'IN', 'OUT', 'ADJUSTMENT'.
- Images should be handled via URLs (external or uploaded to a service, for this MVP we'll use placeholder/Unsplash if no URL provided).
