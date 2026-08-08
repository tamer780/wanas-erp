const AppFooter = () => {
  return (
    <footer className="border-t border-border py-4 pl-3 pr-4 sm:pl-4 sm:pr-6 lg:pl-4 lg:pr-8">
      <p className="text-center text-xs text-text-muted sm:text-left">
        &copy; {new Date().getFullYear()} Wanas Group ERP. All rights reserved.
      </p>
    </footer>
  );
};

export default AppFooter;
