import AppRouter from './routes/AppRouter';

function App() {
  return (
    // The selection colors ensure the Solar Yellow accent is everywhere
    <div className="antialiased selection:bg-cghb-yellow selection:text-black">
      <AppRouter />
    </div>
  );
}

export default App;