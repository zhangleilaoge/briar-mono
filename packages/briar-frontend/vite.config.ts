import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  build:{
    minify:false,
    rollupOptions:{
      output:{ 
        manualChunks:(id)=>{
            if(id.includes("node_modules")){
                return "vendor";
            }
        }
    }
    }
  }
})
