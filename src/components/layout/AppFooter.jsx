const AppFooter = () => {
  return (
    <footer className="border-t border-border px-4 py-4 sm:px-6 lg:px-8">
      <p className="text-center text-xs text-text-muted sm:text-left">
        &copy; {new Date().getFullYear()} Wanas Group ERP. All rights reserved.
      </p>
    </footer>
  );
};

export default AppFooter;
