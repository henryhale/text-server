package fs

import (
	"errors"
	"os"
	"path/filepath"
	"strings"
)

// check if target path exists under the workspace path.
func validatePath(workspace string, targetPath string) (string, error) {
	absTarget, err := filepath.Abs(filepath.Join(workspace, targetPath))
	if err != nil {
		return "", err
	}

	absTarget = filepath.Clean(absTarget)

	valid := strings.HasPrefix(absTarget, workspace)

	if !valid {
		return "", errors.New("invalid path")
	}

	return absTarget, nil
}

// read a file in the workspace.
func ReadWorkspaceFile(workspace string, filePath string) (string, error) {
	fp, err := validatePath(workspace, filePath)
	if err != nil {
		return "", err
	}

	content, err := os.ReadFile(fp)
	if err != nil {
		return "", err
	}

	return string(content), nil
}

// write a file in the workspace.

const PERM_WRITE_FILE int = 0600

func WriteWorkspaceFile(workspace string, filePath string, content string) error {
	fp, err := validatePath(workspace, filePath)
	if err != nil {
		return err
	}

	err = os.WriteFile(fp, []byte(content), os.FileMode(PERM_WRITE_FILE))
	if err != nil {
		return err
	}

	return nil
}

// build a directory tree

type Node struct {
	Name    string `json:"name"`
	Path    string `json:"path"`
	IsDir   bool   `json:"dir"`
	Files   []Node `json:"files,omitempty"`
	Folders []Node `json:"folders,omitempty"`
}

func GetWorkspaceTree(workspace string) (Node, error) {
	var buildTree func(string, string) (Node, error)

	buildTree = func(path string, rel string) (Node, error) {
		info, err := os.Stat(path)
		if err != nil {
			return Node{}, err
		}

		node := Node{
			Name:  info.Name(),
			IsDir: info.IsDir(),
			Path:  rel,
		}

		if !node.IsDir {
			return node, nil
		}

		entries, err := os.ReadDir(path)
		if err != nil {
			return Node{}, err
		}

		for _, entry := range entries {
			// skip dotfiles
			if strings.HasPrefix(entry.Name(), ".") {
				continue
			}
			// skip binaries or executables
			// if !entry.IsDir() && entry.Mode()&0111 != 0 {
			//	continue
			// }

			childPath := filepath.Join(path, entry.Name())
			childRelativePath := filepath.Join(rel, entry.Name())

			childNode, err := buildTree(childPath, childRelativePath)
			if err != nil {
				return Node{}, nil
			}

			if childNode.IsDir {
				node.Folders = append(node.Folders, childNode)
			} else {
				node.Files = append(node.Files, childNode)
			}
		}

		return node, nil
	}

	root, err := buildTree(workspace, ".")

	return root, err
}

// rename a file in the workspace.
func RenameWorkspaceFile(workspace string, oldPath string, newName string) error {
	newPath := filepath.Join(filepath.Dir(oldPath), newName)

	op, err := validatePath(workspace, oldPath)
	if err != nil {
		return err
	}

	np := filepath.Join(workspace, newPath)
	if !strings.HasPrefix(np, workspace) {
		return errors.New("invalid path")
	}

	err = os.Rename(op, np)
	if err != nil {
		return err
	}

	return nil
}

// create a file in the workspace.

const PERM_CREATE_DIR int = 0750

func CreateWorkspaceFile(workspace string, filePath string) error {
	fp := filepath.Join(workspace, filePath)

	_, err := os.Stat(fp)
	if err == nil {
		return errors.New("file already exists")
	}

	baseDir := filepath.Dir(fp)

	_, err = os.Stat(baseDir)
	if err != nil {
		if os.IsNotExist(err) {
			if err := os.MkdirAll(baseDir, os.FileMode(PERM_CREATE_DIR)); err != nil {
				return err
			}
		}
	}

	err = os.WriteFile(fp, []byte(""), os.FileMode(PERM_WRITE_FILE))
	if err != nil {
		return err
	}

	return nil
}
