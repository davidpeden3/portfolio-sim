# Common Components

This directory contains reusable components that can be used throughout the application.

## Components

### Modal

A reusable modal component that can be shown/hidden and contains a title and content.

```jsx
<Modal
  isOpen={isModalOpen}
  onClose={() => setModalOpen(false)}
  title="Modal Title"
  size="md" // 'sm', 'md', 'lg', 'xl'
>
  Modal content goes here
</Modal>
```

### DropdownMenu

A reusable dropdown menu component that shows a menu when clicked.

```jsx
<DropdownMenu
  label="Actions"
  icon={<svg>...</svg>}
  items={[
    {
      label: "Option 1",
      icon: <svg>...</svg>,
      onClick: () => console.log("Option 1 clicked")
    },
    {
      label: "Option 2",
      icon: <svg>...</svg>,
      onClick: () => console.log("Option 2 clicked")
    }
  ]}
/>
```

### Panel

A reusable panel component with consistent styling for form sections.

```jsx
<Panel
  title="Panel Title"
  description="Optional description text"
  className="mb-4" // Optional additional classes
  rightElement={<button>Action</button>} // Optional element to show at top-right
>
  Panel content goes here
</Panel>
```

## Usage

Import these components and use them throughout the application to maintain consistent styling and behavior:

```jsx
import Modal from './common/Modal';
import DropdownMenu from './common/DropdownMenu';
import Panel from './common/Panel';
```

See the `examples` directory for usage examples of each component.