import { useLanguage } from "@/store/slices/questions/questionsHooks";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Languages } from "lucide-react";
import { LocaleEnum } from "@/types/api-types";

export const HeaderComponent = () => {
  const { language, changeLanguage } = useLanguage();
  console.log(LocaleEnum);

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">Kiosk</h1>
            <Badge variant="secondary">ESG Form</Badge>
          </div>
          <div className="flex items-center gap-3">
            <Languages className="h-4 w-4 text-muted-foreground" />
            <div className="flex gap-2">
              {Object.keys(LocaleEnum).map((locale: string) => (
                <Button
                  key={locale}
                  onClick={() =>
                    changeLanguage(locale.toLowerCase() as LocaleEnum)
                  }
                  variant={
                    language === locale.toLowerCase() ? "default" : "outline"
                  }
                  size="sm"
                >
                  {locale.toUpperCase()}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
