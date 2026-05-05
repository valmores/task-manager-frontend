import { Box } from '@mui/material';
import { Navbar } from '@/components/layout/navbar';
import { ProtectedWrapper } from '@/components/auth/protected-wrapper';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default' }}>
        <ProtectedWrapper>
          {children}
        </ProtectedWrapper>
      </Box>
    </Box>
  );
}
