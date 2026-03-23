import { useRouter, useSearch } from '@tanstack/react-router'
import type { InferFullSearchSchema } from '@tanstack/react-router'
import type { FileRoutesById } from '../routeTree.gen'

type RouteSearch<TId extends keyof FileRoutesById> = InferFullSearchSchema<FileRoutesById[TId]>

export type RouteContext = keyof FileRoutesById

type ModalStateOptions<TFrom extends RouteContext, TKey extends keyof RouteSearch<TFrom> & string> = {
  from?: TFrom;
  paramName: TKey;
  openValue: RouteSearch<TFrom>[TKey];
};

function saveWasPushedToStorage(key: string, value: boolean) {
  sessionStorage.setItem(key, value ? 'true' : 'false');
}

function useModalState<TFrom extends RouteContext = '__root__', TKey extends keyof RouteSearch<TFrom> & string = keyof RouteSearch<TFrom> & string>({
  from: _from,
  paramName,
  openValue,
}: ModalStateOptions<TFrom, TKey> & { from?: TFrom }) {
  const router = useRouter();
  
  // Get search params without strict typing to avoid type errors
  const search = useSearch({ strict: false });
  const value = Reflect.get(search, paramName);
  
  const SESSION_KEY_PREFIX = "UMS_modal_pushed_";

  const SESSION_STORAGE_KEY = `${SESSION_KEY_PREFIX}${paramName}_${openValue}`;

  const isOpen = value === openValue;


  const openModal = () => {
    console.log("running openModal");
    saveWasPushedToStorage(SESSION_STORAGE_KEY, true); // Record: "we're pushing this"
    
    // Push new history entry with modal param
    router.navigate({
      to: '.',
      search: (prev) => ({ ...prev, [paramName]: openValue }),
      replace: false
    });
  };

  function cleanupStorage() {
    for (let i = sessionStorage.length - 1; i >= 0; i--) {
      const key = sessionStorage.key(i);
      if (key && typeof key === 'string' && key.startsWith(SESSION_KEY_PREFIX)) {
        const value = sessionStorage.getItem(key);
        if (value !== "true") {
          sessionStorage.removeItem(key);
          console.log(`Removed ${key} with value: ${value}`);
        }
      }
    }
  }

  function getCurrentStorageState() {
    return sessionStorage.getItem(SESSION_STORAGE_KEY) === "true";
  }

  const closeModal = (url?: string) => {
    console.log("running closeModal function", { url });

    // manually get wasPushed to avoid stale closure
    const wasPushed = getCurrentStorageState();
    console.log("running closeModal", { wasPushed });
    console.log("sessionStorage before cleanup:", { ...sessionStorage });
    
    if (wasPushed) {
      // We pushed it, safe to go back
      saveWasPushedToStorage(SESSION_STORAGE_KEY, false);
      cleanupStorage();

      console.log("running closeModal with history.back()");
      if (url && typeof url === 'string') {
        router.navigate({ to: url, replace: true });
      } else {
        window.history.back();
      }
    } else {
      // Direct navigation, use push to support back button to view the modal again
      console.log("running closeModal with setValue");
      if (url && typeof url === 'string') {
        router.navigate({ to: url, replace: false });
      } else {
        // Push new state with param removed to support back button
        router.navigate({
          to: '.',
          search: (prev) => {
            const { [paramName]: _, ...rest } = prev;
            return rest;
          },
          replace: false,
        });
      }
    }
  };

  const setIsOpen = (open: boolean) => {
    if (open) {
      openModal();
    } else {
      closeModal();
    }
  };

  return { isOpen, openModal, closeModal, value, setIsOpen };
}

export default useModalState;

