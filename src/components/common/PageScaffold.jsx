import { useEffect } from "react";
import Breadcrumb from "./Breadcrumb";
import PageHeader from "./PageHeader";

const PageScaffold = ({
  title,
  description,
  breadcrumbs = [],
  actions,
  children,
  documentTitle,
}) => {
  useEffect(() => {
    document.title = documentTitle
      ? `Wanas Group | ${documentTitle}`
      : `Wanas Group | ${title}`;
  }, [documentTitle, title]);

  return (
    <div className="w-full">
      <Breadcrumb items={breadcrumbs} />
      <PageHeader title={title} description={description} actions={actions} />
      <div className="min-h-72">{children}</div>
    </div>
  );
};

export default PageScaffold;
