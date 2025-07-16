# Fernet Branca Token Faucet

Un faucet simple y elegante para distribuir tokens Fernet Branca en la red Starknet.

## 🚀 Características

- **Interfaz Simple**: Un botón para conectar wallet y otro para hacer claim
- **Control de Tiempo**: Rate limiting incorporado para evitar spam
- **Starknet Nativo**: Construido específicamente para Starknet Sepolia
- **Responsive**: Funciona perfectamente en desktop y mobile

## 🛠 Tecnologías

- **Frontend**: Next.js 14, React, TypeScript, TailwindCSS
- **Blockchain**: Cairo, Starknet
- **Wallet Integration**: StarknetKit, get-starknet

## 📋 Prerrequisitos

- Node.js 18+
- npm o yarn
- Wallet compatible con Starknet (Argent X, Braavos)

## 🚀 Instalación y Uso

### 1. Clonar e instalar dependencias

   ```bash
git clone <your-repo>
cd faucet/frontend
   npm install
   ```

### 2. Configurar el contrato

Actualiza la dirección del contrato en `lib/contract.ts`:

```typescript
export const FAUCET_CONTRACT_ADDRESS = "0x..." // Tu dirección del contrato deployado
```

### 3. Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### 4. Build para producción

```bash
npm run build
npm start
```

## 🎯 Cómo usar el Faucet

1. **Conectar Wallet**: Haz clic en "Connect Wallet" y selecciona tu wallet preferida
2. **Verificar Balance**: El faucet mostrará cuántos tokens están disponibles
3. **Claim Tokens**: Haz clic en "Claim Tokens" para recibir tu asignación
4. **Esperar**: Respeta el tiempo de espera antes del próximo claim

## 🔧 Configuración del Contrato

El contrato faucet permite:

- **faucet_mint()**: Función principal para hacer claim de tokens
- **get_user_unlock_time()**: Verificar cuándo puede hacer claim de nuevo
- **get_withdrawal_amount()**: Ver cuántos tokens se pueden reclamar
- **get_amount_faucet()**: Ver el balance total del faucet

## 🎨 Personalización

### Colores y Estilos

Los estilos están en TailwindCSS. Puedes modificar:

- `tailwind.config.js`: Configuración de colores
- Componentes individuales para estilos específicos

### Texto y Branding

- Actualiza `components/Header.tsx` para cambiar el branding
- Modifica `app/page.tsx` para cambiar el texto principal

## 🧪 Testing

El frontend incluye validaciones para:

- ✅ Conexión de wallet
- ✅ Verificación de balance del faucet
- ✅ Control de tiempo de espera
- ✅ Manejo de errores

## 📱 Responsive Design

El faucet está optimizado para:

- 📱 Mobile (375px+)
- 💻 Tablet (768px+)
- 🖥 Desktop (1024px+)

## 🚨 Consideraciones de Seguridad

- El contrato implementa rate limiting
- Solo un claim por período de tiempo
- Verificación de balance antes del claim
- Manejo seguro de errores

## 🛠 Desarrollo

### Estructura del Proyecto

```
frontend/
├── app/                 # Next.js App Router
├── components/          # Componentes React
│   ├── FaucetClaim.tsx  # Componente principal del faucet
│   ├── WalletConnection.tsx
│   └── providers/
├── lib/                 # Utilidades y configuración
│   ├── contract.ts      # ABI y direcciones del contrato
│   └── utils.ts
└── public/             # Assets estáticos
```

### Comandos Disponibles

```bash
npm run dev          # Desarrollo
npm run build        # Build para producción
npm run start        # Servidor de producción
npm run lint         # Linting
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una branch para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para detalles.

## 🙏 Agradecimientos

- [Starknet](https://starknet.io/) por la infraestructura
- [OpenZeppelin](https://www.openzeppelin.com/) por los componentes de seguridad
- [Next.js](https://nextjs.org/) por el framework
- [TailwindCSS](https://tailwindcss.com/) por el styling

---

🚀 **¡Disfruta distribuyendo tokens Fernet Branca en Starknet!** 