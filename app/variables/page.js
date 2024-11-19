import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import VariableGenerator from "./components/variableGenerator";

const page = async () => {
  const sendEventData = async () => {
    try {
      const response = await fetch("https://tss.ticombo.fr/mp/collect/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Gtm-Server-Preview":
            "ZW52LTMwfGZaU2tGYUNNWVV5T19zN19jVjBlSkF8MTkyZDkzZjhmODBjZmQyY2ZkNzVj",
        },
        body: JSON.stringify({
          events: [
            {
              name: "OfflineConversionTest4",
              params: {
                // page_location:
                //   "https://www.ticombo.fr/fr/discover/bc2370dc-712a-42c9-aa10-5def8f6ae7be/e1-wmP4YBYfhrun/buy",
                // user_agent:
                //   "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36",
                // ip_override: "168.212.226.204",
                // // client_ip_address: "168.212.226.204",
                user_data: {
                  user_mail: "william@gmail.com",
                  user_phone: "09876543210",
                  user_first_name: "william",
                  user_last_name: "voyez",
                  user_id: "0123456789",
                  new_customer: true,
                  customer_ltv: 546.43,
                },
                _fbp: "fb.1.1725877679390.200540810169207808",
                _fbc: "fb.1.1554763741205.IwAR2F4-dbP0l7Mn1IawQQGCINEz7PYXQvwjNwB_qa2ofrHyiLjcbCRxTDGrc",
                gclid: "123456789",
                consent_marketing: true,
                value: 150.0,
                currency: "EUR",
                proposal_id: "53763768553",
                transaction_id: "87654356789765432786543",
                items: [
                  {
                    item_id: "76543",
                    item_name: "item name",
                    quantity: 3,
                    item_category: "Category",
                    price: 50,
                  },
                ],
              },
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error:", errorData);
      } else {
        const result = await response.json();
        console.log("Success:", result);
      }
    } catch (error) {
      console.error("Network or Fetch error:", error);
    }
  };

  // sendEventData();

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="flex flex-col bg-[#fafafa]">
        <Header title="Générateur de variables dataLayer" />
        <main className="flex flex-1 flex-col gap-4 px-4 lg:gap-6 lg:px-10 pb-8">
          <div className="w-full  mx-auto">
            <VariableGenerator />
          </div>
        </main>
      </div>
    </div>
  );
};

export default page;
